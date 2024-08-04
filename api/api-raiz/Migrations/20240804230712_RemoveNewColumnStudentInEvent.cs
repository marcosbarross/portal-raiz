using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api_raiz.Migrations
{
    /// <inheritdoc />
    public partial class RemoveNewColumnStudentInEvent : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Events_Students_StudentNameregistration",
                table: "Events");

            migrationBuilder.DropIndex(
                name: "IX_Events_StudentNameregistration",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "StudentNameregistration",
                table: "Events");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "StudentNameregistration",
                table: "Events",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Events_StudentNameregistration",
                table: "Events",
                column: "StudentNameregistration");

            migrationBuilder.AddForeignKey(
                name: "FK_Events_Students_StudentNameregistration",
                table: "Events",
                column: "StudentNameregistration",
                principalTable: "Students",
                principalColumn: "registration",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
