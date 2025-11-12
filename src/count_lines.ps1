$files = Get-ChildItem -Recurse -Filter *.ts*
$total = 0
foreach ($f in $files) {
    $count = (Get-Content $f.FullName | Measure-Object -Line).Lines
    Write-Host "$($f.FullName): $count"
    $total += $count
}
Write-Host "-----------------------------"
Write-Host "total: $total"
