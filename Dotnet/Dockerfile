# שלב בסיס – ריצה
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER root
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

# התקנת ffmpeg ב־Linux
RUN apt-get update && apt-get install -y ffmpeg

# שלב בנייה
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

COPY ["Magical_Music/Magical_Music.API.csproj", "Magical_Music/"]
COPY ["Magical_Music.CORE/Magical_Music.CORE.csproj", "Magical_Music.CORE/"]
COPY ["Magical_Music.DATA/Magical_Music.DATA.csproj", "Magical_Music.DATA/"]
COPY ["Magical_Music.SERVICE/Magical_Music.SERVICE.csproj", "Magical_Music.SERVICE/"]

RUN dotnet restore "Magical_Music/Magical_Music.API.csproj"
COPY . .
WORKDIR "/src/Magical_Music"
RUN dotnet build "Magical_Music.API.csproj" -c $BUILD_CONFIGURATION -o /app/build

# שלב פרסום
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "Magical_Music.API.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# שלב סופי
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Magical_Music.API.dll"]
