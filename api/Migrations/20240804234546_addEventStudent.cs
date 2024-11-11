using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace api_raiz.Migrations
{
    /// <inheritdoc />
    public partial class addEventStudent : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "registration",
                table: "Students",
                newName: "Registration");

            migrationBuilder.RenameColumn(
                name: "Responsanble",
                table: "Students",
                newName: "Responsible");

            migrationBuilder.CreateTable(
                name: "EventStudents",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    EventId = table.Column<int>(type: "integer", nullable: false),
                    StudentId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EventStudents", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EventStudents_Events_EventId",
                        column: x => x.EventId,
                        principalTable: "Events",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_EventStudents_Students_StudentId",
                        column: x => x.StudentId,
                        principalTable: "Students",
                        principalColumn: "Registration",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_EventStudents_EventId",
                table: "EventStudents",
                column: "EventId");

            migrationBuilder.CreateIndex(
                name: "IX_EventStudents_StudentId",
                table: "EventStudents",
                column: "StudentId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EventStudents");

            migrationBuilder.RenameColumn(
                name: "Registration",
                table: "Students",
                newName: "registration");

            migrationBuilder.RenameColumn(
                name: "Responsible",
                table: "Students",
                newName: "Responsanble");
        }
    }
}
