export interface BreadcrumbItem {
  label: string
  href?: string
  isCurrentPage?: boolean
}

export interface BreadcrumbConfig {
  items: BreadcrumbItem[]
  showBackButton?: boolean
  backButtonHref?: string
}

export function generateBreadcrumbs(pathname: string, walletName?: string): BreadcrumbConfig {
  // 儀表板首頁
  if (pathname === '/dashboard') {
    return {
      items: [
        { label: '儀表板', isCurrentPage: true }
      ]
    }
  }

  // 錢包詳情頁面
  if (pathname.startsWith('/dashboard/wallets/') && pathname.split('/').length === 4) {
    return {
      items: [
        { label: '儀表板', href: '/dashboard' },
        { label: '錢包', href: '/dashboard' },
        { label: walletName || '錢包詳情', isCurrentPage: true }
      ],
      showBackButton: true,
      backButtonHref: '/dashboard'
    }
  }

  // 預設情況
  return {
    items: [
      { label: '儀表板', href: '/dashboard' }
    ]
  }
}