using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable   

namespace Magical_Music.DATA.Migrations
{
    /// <inheritdoc />
    public partial class MigrationMagical_Music : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Songs_Users_UserId",
                table: "Songs");

            migrationBuilder.DropIndex(
                name: "IX_Songs_UserId",
                table: "Songs");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Songs");

            migrationBuilder.RenameColumn(
                name: "creatorId",
                table: "Songs",
                newName: "singerId");

            migrationBuilder.CreateTable(
                name: "Singers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Singers", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "SongUser",
                columns: table => new
                {
                    SongsId = table.Column<int>(type: "int", nullable: false),
                    UsersId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SongUser", x => new { x.SongsId, x.UsersId });
                    table.ForeignKey(
                        name: "FK_SongUser_Songs_SongsId",
                        column: x => x.SongsId,
                        principalTable: "Songs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SongUser_Users_UsersId",
                        column: x => x.UsersId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_Songs_singerId",
                table: "Songs",
                column: "singerId");

            migrationBuilder.CreateIndex(
                name: "IX_SongUser_UsersId",
                table: "SongUser",
                column: "UsersId");

            migrationBuilder.AddForeignKey(
                name: "FK_Songs_Singers_singerId",
                table: "Songs",
                column: "singerId",
                principalTable: "Singers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Songs_Singers_singerId",
                table: "Songs");

            migrationBuilder.DropTable(
                name: "Singers");

            migrationBuilder.DropTable(
                name: "SongUser");

            migrationBuilder.DropIndex(
                name: "IX_Songs_singerId",
                table: "Songs");

            migrationBuilder.RenameColumn(
                name: "singerId",
                table: "Songs",
                newName: "creatorId");

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "Songs",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Songs_UserId",
                table: "Songs",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Songs_Users_UserId",
                table: "Songs",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id");
        }
    }
}
