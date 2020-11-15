using Microsoft.EntityFrameworkCore.Migrations;

namespace Tazkr.Migrations
{
    public partial class AddIsPubliclyVisible : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsPubliclyVisible",
                table: "Boards",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsPubliclyVisible",
                table: "Boards");
        }
    }
}
