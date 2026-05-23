$missingPages = @(
  "src\pages\Categories\CategoriesPage.jsx",
  "src\pages\Categories\CategoryDetail.jsx",
  "src\pages\Recommendations\RecommendationsPage.jsx",
  "src\pages\Explore\ExplorePage.jsx",
  "src\pages\Chat\ChatPage.jsx",
  "src\pages\Chat\ChatConversation.jsx",
  "src\pages\Groups\GroupsPage.jsx",
  "src\pages\Groups\GroupDetail.jsx",
  "src\pages\QandA\QandAPage.jsx",
  "src\pages\QandA\QuestionDetail.jsx",
  "src\pages\Safety\SafetyPage.jsx",
  "src\pages\Rewards\RewardsPage.jsx",
  "src\pages\Privacy\PrivacyPage.jsx",
  "src\admin\AdminLayout.jsx",
  "src\admin\Dashboard.jsx",
  "src\admin\ContentManager.jsx",
  "src\admin\UserManager.jsx",
  "src\admin\ModerationPanel.jsx"
)

foreach ($page in $missingPages) {
  $name = [System.IO.Path]::GetFileNameWithoutExtension($page)
  $content = @"
import React from 'react'

export default function $name() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>$name</h2>
      <p>Página en construcción</p>
    </div>
  )
}
"@
  Set-Content -Path $page -Value $content -Encoding UTF8
}
Write-Output "Stubbed all missing pages"
