# Script para corrigir imports MediaService -> MediaManager
$files = @(
    "BaseActivity.java",
    "AlbumPageFragment.java", 
    "DirectoryFragment.java",
    "DownloadFragment.java",
    "HomeTabMusicFragment.java",
    "HomeTabRadioFragment.java",
    "PlayerControllerFragment.java",
    "PlayerLyricsFragment.java",
    "PlayerQueueFragment.java",
    "PlaylistPageFragment.java",
    "PodcastChannelPageFragment.java",
    "SearchFragment.java",
    "SongListPageFragment.java"
)

$bottomSheetFiles = @(
    "AlbumBottomSheetDialog.java",
    "ArtistBottomSheetDialog.java", 
    "DownloadedBottomSheetDialog.java",
    "PodcastChannelBottomSheetDialog.java",
    "PodcastEpisodeBottomSheetDialog.java",
    "SongBottomSheetDialog.java"
)

$basePath = "c:\Users\isy\Documents\GitHub\yumusic\app\src\main\java"

# Corrigir arquivos principais
foreach ($file in $files) {
    $foundFiles = Get-ChildItem -Path $basePath -Recurse -Name $file
    foreach ($foundFile in $foundFiles) {
        $fullPath = Join-Path $basePath $foundFile
        if (Test-Path $fullPath) {
            $content = Get-Content $fullPath -Raw
            $newContent = $content -replace 'import com\.cappielloantonio\.tempo\.service\.MediaService;', 'import com.cappielloantonio.tempo.service.MediaManager;'
            if ($content -ne $newContent) {
                Set-Content -Path $fullPath -Value $newContent -NoNewline
                Write-Host "Fixed: $fullPath"
            }
        }
    }
}

# Corrigir arquivos bottomsheet
foreach ($file in $bottomSheetFiles) {
    $foundFiles = Get-ChildItem -Path $basePath -Recurse -Name $file
    foreach ($foundFile in $foundFiles) {
        $fullPath = Join-Path $basePath $foundFile
        if (Test-Path $fullPath) {
            $content = Get-Content $fullPath -Raw
            $newContent = $content -replace 'import com\.cappielloantonio\.tempo\.service\.MediaService;', 'import com.cappielloantonio.tempo.service.MediaManager;'
            if ($content -ne $newContent) {
                Set-Content -Path $fullPath -Value $newContent -NoNewline
                Write-Host "Fixed: $fullPath"
            }
        }
    }
}

Write-Host "Import fixes completed!"
