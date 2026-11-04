import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ShowService } from '../../../core/services/show.service';
import { TheatreService } from '../../../core/services/theatre.service';
import { Show } from '../../../models/show.model';
import { Theatre } from '../../../models/theatre.model';

@Component({
  selector: 'app-show-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './show-list.component.html',
  styleUrls: ['./show-list.component.css']
})
export class ShowListComponent implements OnInit {
  shows: Show[] = [];
  theatres: Theatre[] = [];
  selectedTheatreId: number = 0;
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(
    private showService: ShowService,
    private theatreService: TheatreService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadTheatres();
    this.loadShows();
  }

  loadTheatres(): void {
    this.theatreService.getAllTheatres().subscribe({
      next: (data) => {
        this.theatres = data || [];
        this.cdr.markForCheck();
      },
      error: () => { }
    });
  }

  loadShows(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.markForCheck();

    const obs =
      this.selectedTheatreId > 0
        ? this.showService.getShowsByTheatre(this.selectedTheatreId)
        : this.showService.getAllShows();

    obs.subscribe({
      next: (data) => {
        this.shows = data || [];
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load show schedules.';
        this.cdr.markForCheck();
      }
    });
  }

  onFilterTheatre(theatreId: number): void {
    this.selectedTheatreId = theatreId;
    this.loadShows();
  }
}
