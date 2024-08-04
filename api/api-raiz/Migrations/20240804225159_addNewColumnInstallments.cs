using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api_raiz.Migrations
{
    /// <inheritdoc />
    public partial class addNewColumnInstallments : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Events_Students_studentNameregistration",
                table: "Events");

            migrationBuilder.RenameColumn(
                name: "studentNameregistration",
                table: "Events",
                newName: "StudentNameregistration");

            migrationBuilder.RenameColumn(
                name: "installments",
                table: "Events",
                newName: "Installments");

            migrationBuilder.RenameIndex(
                name: "IX_Events_studentNameregistration",
                table: "Events",
                newName: "IX_Events_StudentNameregistration");

            migrationBuilder.AddForeignKey(
                name: "FK_Events_Students_StudentNameregistration",
                table: "Events",
                column: "StudentNameregistration",
                principalTable: "Students",
                principalColumn: "registration",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Events_Students_StudentNameregistration",
                table: "Events");

            migrationBuilder.RenameColumn(
                name: "StudentNameregistration",
                table: "Events",
                newName: "studentNameregistration");

            migrationBuilder.RenameColumn(
                name: "Installments",
                table: "Events",
                newName: "installments");

            migrationBuilder.RenameIndex(
                name: "IX_Events_StudentNameregistration",
                table: "Events",
                newName: "IX_Events_studentNameregistration");

            migrationBuilder.AddForeignKey(
                name: "FK_Events_Students_studentNameregistration",
                table: "Events",
                column: "studentNameregistration",
                principalTable: "Students",
                principalColumn: "registration",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
