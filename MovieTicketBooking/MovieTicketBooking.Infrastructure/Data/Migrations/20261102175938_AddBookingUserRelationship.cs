using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MovieTicketBooking.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddBookingUserRelationship : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Seats_Screens_ScreenId",
                table: "Seats");

            migrationBuilder.DropCheckConstraint(
                name: "CK_Show_EndTime",
                table: "Shows");

            migrationBuilder.DropCheckConstraint(
                name: "CK_Show_TicketPrice",
                table: "Shows");

            migrationBuilder.DropCheckConstraint(
                name: "CK_Seat_SeatNumber",
                table: "Seats");

            migrationBuilder.AlterColumn<string>(
                name: "Email",
                table: "Users",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "SeatType",
                table: "Seats",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(30)",
                oldMaxLength: 30);

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "Bookings",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);

            migrationBuilder.AddCheckConstraint(
                name: "CK_Show_TicketPrice",
                table: "Shows",
                sql: "[TicketPrice] > 0");

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_UserId",
                table: "Bookings",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Bookings_Users_UserId",
                table: "Bookings",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Seats_Screens_ScreenId",
                table: "Seats",
                column: "ScreenId",
                principalTable: "Screens",
                principalColumn: "ScreenId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Bookings_Users_UserId",
                table: "Bookings");

            migrationBuilder.DropForeignKey(
                name: "FK_Seats_Screens_ScreenId",
                table: "Seats");

            migrationBuilder.DropIndex(
                name: "IX_Users_Email",
                table: "Users");

            migrationBuilder.DropCheckConstraint(
                name: "CK_Show_TicketPrice",
                table: "Shows");

            migrationBuilder.DropIndex(
                name: "IX_Bookings_UserId",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Bookings");

            migrationBuilder.AlterColumn<string>(
                name: "Email",
                table: "Users",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "SeatType",
                table: "Seats",
                type: "nvarchar(30)",
                maxLength: 30,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(20)",
                oldMaxLength: 20);

            migrationBuilder.AddCheckConstraint(
                name: "CK_Show_EndTime",
                table: "Shows",
                sql: "[EndTime] > [StartTime]");

            migrationBuilder.AddCheckConstraint(
                name: "CK_Show_TicketPrice",
                table: "Shows",
                sql: "[TicketPrice] >= 0");

            migrationBuilder.AddCheckConstraint(
                name: "CK_Seat_SeatNumber",
                table: "Seats",
                sql: "[SeatNumber] > 0");

            migrationBuilder.AddForeignKey(
                name: "FK_Seats_Screens_ScreenId",
                table: "Seats",
                column: "ScreenId",
                principalTable: "Screens",
                principalColumn: "ScreenId",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
