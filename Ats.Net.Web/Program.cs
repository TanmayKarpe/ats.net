using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

// Static assets: include wwwroot plus shared assets from the React source and built dist bundle.
app.UseHttpsRedirection();
app.UseStaticFiles();

// Expose the original React asset folder so images can be reused without copying.
var assetsPath = Path.Combine(app.Environment.ContentRootPath, "..", "src", "assets");
if (Directory.Exists(assetsPath))
{
    app.UseStaticFiles(new StaticFileOptions
    {
        FileProvider = new PhysicalFileProvider(assetsPath),
        RequestPath = "/assets"
    });
}

// Expose the built Tailwind bundle from the existing dist output for visual parity.
var distAssetsPath = Path.Combine(app.Environment.ContentRootPath, "..", "dist", "assets");
if (Directory.Exists(distAssetsPath))
{
    app.UseStaticFiles(new StaticFileOptions
    {
        FileProvider = new PhysicalFileProvider(distAssetsPath),
        RequestPath = "/dist-assets"
    });
}

app.UseRouting();

app.UseAuthorization();

app.MapStaticAssets();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}")
    .WithStaticAssets();

app.Run();
