using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api_raiz.Migrations
{
    /// <inheritdoc />
    public partial class addcolumntoorderstudentproduct : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsDelivered",
                table: "OrderStudentProducts",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsDelivered",
                table: "OrderStudentProducts");
        }
    }
}
