"use client"

import { usePathname, useRouter } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { generateBreadcrumbs } from "@/lib/breadcrumb-config"
import { useWalletSafe } from "@/contexts/WalletContext"

export function BreadcrumbNav() {
  const pathname = usePathname()
  const router = useRouter()
  
  // 嘗試取得錢包資訊（在 WalletProvider 外部會返回 null）
  const walletContext = useWalletSafe()
  const walletName = walletContext?.wallet.name

  const breadcrumbConfig = generateBreadcrumbs(pathname, walletName)

  const handleBack = () => {
    if (breadcrumbConfig.backButtonHref) {
      router.push(breadcrumbConfig.backButtonHref)
    }
  }

  return (
    <div className="flex items-center gap-2">
      {/* 返回按鈕 */}
      {breadcrumbConfig.showBackButton && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="p-1 h-auto hover:bg-gray-100"
          aria-label="返回上一頁"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      )}
      
      {/* 麵包屑導航 */}
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbConfig.items.map((item, index) => (
            <div key={index} className="flex items-center">
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {item.isCurrentPage ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    href={item.href || '#'}
                    className="hover:text-foreground"
                  >
                    {item.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}