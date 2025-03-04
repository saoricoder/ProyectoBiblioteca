FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["WebApi3.csproj", "./"]
RUN dotnet restore
COPY . .
RUN dotnet build "WebApi3.csproj" -c Release -o /app/build
RUN dotnet publish "WebApi3.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:7.0
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 80
ENTRYPOINT ["dotnet", "WebApi3.dll"]