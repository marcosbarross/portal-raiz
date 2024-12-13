using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api_raiz.Migrations
{
    /// <inheritdoc />
    public partial class AddLevelToGradeRelation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "LevelId",
                table: "Grades",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Grades_LevelId",
                table: "Grades",
                column: "LevelId");

            migrationBuilder.AddForeignKey(
                name: "FK_Grades_Levels_LevelId",
                table: "Grades",
                column: "LevelId",
                principalTable: "Levels",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Grades_Levels_LevelId",
                table: "Grades");

            migrationBuilder.DropIndex(
                name: "IX_Grades_LevelId",
                table: "Grades");

            migrationBuilder.DropColumn(
                name: "LevelId",
                table: "Grades");
        }
    }
}
