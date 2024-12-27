using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace api_raiz.Migrations
{
    /// <inheritdoc />
    public partial class UpdateGroupModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "level",
                table: "Groups");

            migrationBuilder.DropColumn(
                name: "shift",
                table: "Groups");

            migrationBuilder.RenameColumn(
                name: "name",
                table: "Groups",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "Groups",
                newName: "Id");

            migrationBuilder.AddColumn<int>(
                name: "GradeId",
                table: "Groups",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "LevelId",
                table: "Groups",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ShiftId",
                table: "Groups",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Grades",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Grades", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Levels",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Levels", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Shifts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Shifts", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Groups_GradeId",
                table: "Groups",
                column: "GradeId");

            migrationBuilder.CreateIndex(
                name: "IX_Groups_LevelId",
                table: "Groups",
                column: "LevelId");

            migrationBuilder.CreateIndex(
                name: "IX_Groups_ShiftId",
                table: "Groups",
                column: "ShiftId");

            migrationBuilder.AddForeignKey(
                name: "FK_Groups_Grades_GradeId",
                table: "Groups",
                column: "GradeId",
                principalTable: "Grades",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Groups_Levels_LevelId",
                table: "Groups",
                column: "LevelId",
                principalTable: "Levels",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Groups_Shifts_ShiftId",
                table: "Groups",
                column: "ShiftId",
                principalTable: "Shifts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Groups_Grades_GradeId",
                table: "Groups");

            migrationBuilder.DropForeignKey(
                name: "FK_Groups_Levels_LevelId",
                table: "Groups");

            migrationBuilder.DropForeignKey(
                name: "FK_Groups_Shifts_ShiftId",
                table: "Groups");

            migrationBuilder.DropTable(
                name: "Grades");

            migrationBuilder.DropTable(
                name: "Levels");

            migrationBuilder.DropTable(
                name: "Shifts");

            migrationBuilder.DropIndex(
                name: "IX_Groups_GradeId",
                table: "Groups");

            migrationBuilder.DropIndex(
                name: "IX_Groups_LevelId",
                table: "Groups");

            migrationBuilder.DropIndex(
                name: "IX_Groups_ShiftId",
                table: "Groups");

            migrationBuilder.DropColumn(
                name: "GradeId",
                table: "Groups");

            migrationBuilder.DropColumn(
                name: "LevelId",
                table: "Groups");

            migrationBuilder.DropColumn(
                name: "ShiftId",
                table: "Groups");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Groups",
                newName: "name");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Groups",
                newName: "id");

            migrationBuilder.AddColumn<string>(
                name: "level",
                table: "Groups",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "shift",
                table: "Groups",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
