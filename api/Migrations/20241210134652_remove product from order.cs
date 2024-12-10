using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api_raiz.Migrations
{
    /// <inheritdoc />
    public partial class removeproductfromorder : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProductId",
                table: "Orders");

            migrationBuilder.AddColumn<DateTime>(
                name: "Date",
                table: "OrderStudentProducts",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Date",
                table: "OrderStudentProducts");

            migrationBuilder.AddColumn<int>(
                name: "ProductId",
                table: "Orders",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }
    }
}
