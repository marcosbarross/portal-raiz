using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace api_raiz.Migrations
{
    /// <inheritdoc />
    public partial class newmigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_EventStudents",
                table: "EventStudents");

            migrationBuilder.DropIndex(
                name: "IX_EventStudents_EventId",
                table: "EventStudents");

            migrationBuilder.AlterColumn<int>(
                name: "Id",
                table: "EventStudents",
                type: "integer",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer")
                .OldAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddPrimaryKey(
                name: "PK_EventStudents",
                table: "EventStudents",
                columns: new[] { "EventId", "StudentId" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_EventStudents",
                table: "EventStudents");

            migrationBuilder.AlterColumn<int>(
                name: "Id",
                table: "EventStudents",
                type: "integer",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer")
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddPrimaryKey(
                name: "PK_EventStudents",
                table: "EventStudents",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_EventStudents_EventId",
                table: "EventStudents",
                column: "EventId");
        }
    }
}
