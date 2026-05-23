$dirs = @(
  'src/components/ui',
  'src/components/layout',
  'src/components/common',
  'src/components/chat',
  'src/components/network',
  'src/pages/Entry',
  'src/pages/Onboarding',
  'src/pages/Home',
  'src/pages/Categories',
  'src/pages/Recommendations',
  'src/pages/Explore',
  'src/pages/Chat',
  'src/pages/Groups',
  'src/pages/QandA',
  'src/pages/Safety',
  'src/pages/Rewards',
  'src/pages/Privacy',
  'src/admin',
  'src/store',
  'src/data',
  'src/hooks',
  'src/utils',
  'src/assets/illustrations',
  'public/icons',
  'public/locales'
)

foreach ($dir in $dirs) {
  New-Item -ItemType Directory -Force -Path $dir | Out-Null
}
Write-Output "All directories created successfully"
