using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Magical_Music.DATA.Migrations
{
    /// <inheritdoc />
    public partial class AddKeyToSongs : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Songs_Singers_singerId",
                table: "Songs");

            migrationBuilder.DropTable(
                name: "SongUser");

            migrationBuilder.RenameColumn(
                name: "singerId",
                table: "Songs",
                newName: "SingerId");

            migrationBuilder.RenameIndex(
                name: "IX_Songs_singerId",
                table: "Songs",
                newName: "IX_Songs_SingerId");

            migrationBuilder.AlterColumn<int>(
                name: "SingerId",
                table: "Songs",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<string>(
                name: "Key",
                table: "Songs",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "S3Url",
                table: "Songs",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

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
                name: "FK_Songs_Singers_SingerId",
                table: "Songs",
                column: "SingerId",
                principalTable: "Singers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Songs_Users_UserId",
                table: "Songs",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Songs_Singers_SingerId",
                table: "Songs");

            migrationBuilder.DropForeignKey(
                name: "FK_Songs_Users_UserId",
                table: "Songs");

            migrationBuilder.DropIndex(
                name: "IX_Songs_UserId",
                table: "Songs");

            migrationBuilder.DropColumn(
                name: "Key",
                table: "Songs");

            migrationBuilder.DropColumn(
                name: "S3Url",
                table: "Songs");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Songs");

            migrationBuilder.RenameColumn(
                name: "SingerId",
                table: "Songs",
                newName: "singerId");

            migrationBuilder.RenameIndex(
                name: "IX_Songs_SingerId",
                table: "Songs",
                newName: "IX_Songs_singerId");

            migrationBuilder.AlterColumn<int>(
                name: "singerId",
                table: "Songs",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

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
    }
}
