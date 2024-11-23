---
title: リンクボタンの実装について
description: Next.jsでリンクボタンを実装する際の選択肢として、
---

# リンクボタンの実装について

Next.jsでリンクボタンを実装する際の選択肢として、
1. ButtonコンポーネントにonClickとuseRouterを使用する方法
```tsx
<Button onClick={() => router.push("/")}>
  Link
</Button>
```
2. Buttonコンポーネント内にLinkを設置する方法
```tsx
<Button>
  <Link href="/">Link</Link>
</Button>
```
があります。それぞれの方法の利点と欠点を考慮して、どちらが適しているかを判断することが重要です。

## 結論
シンプルなナビゲーションであればLink、そうでない場合はButtonコンポーネントにonClickとuseRouterを使用する方法が適しています。

## 1. ButtonコンポーネントにonClickとuseRouterを使用する方法
利点
- 柔軟性: onClickハンドラー内で追加のロジックを実行することができます。例えば、ナビゲーション前に何らかの処理を行いたい場合に便利です。
- 条件付きナビゲーション: 特定の条件に基づいてナビゲーションを制御することができます。
欠点
- コードの複雑化: 単純なリンクの場合、余分なコードが増える可能性があります。

実装例
```tsx
import { useRouter } from 'next/router';
import { Button } from '@aero/ui/components/ui/button';

function NavigateButton() {
  const router = useRouter();

  const handleClick = () => {
    // 追加のロジックをここに記述
    router.push('/target-page');
  };

  return (
    <Button onClick={handleClick}>
      Go to Target Page
    </Button>
  );
}
```

## 2. Buttonコンポーネント内にLinkを設置する方法
利点
- シンプルさ: 単純なナビゲーションの場合、コードが簡潔になります。
- SEO: Linkコンポーネントは、クライアントサイドのナビゲーションを提供しつつ、SEOに有利です。
欠点
- 柔軟性の欠如: ナビゲーション前に追加のロジックを実行するのが難しいです。

実装例
```tsx
import Link from 'next/link';
import { Button } from '@aero/ui/components/ui/button';

function NavigateButton() {
  return (
    <Button>
      <Link href="/target-page">Go to Target Page</Link>
    </Button>
  );
}
```

## 追記：複雑なロジックとは？
複雑なロジックについていくつか例を挙げます：

1. フォーム送信とナビゲーションの組み合わせ
```tsx
const handleSubmitAndNavigate = async () => {
  try {
    // フォームのバリデーション
    const isValid = await validateForm(formData);
    if (!isValid) return;

    // APIへのデータ送信
    const response = await submitData(formData);
    
    // 成功時のみナビゲーション
    if (response.success) {
      toast.success("保存が完了しました");
      router.push(`/organizations/${response.data.id}`);
    }
  } catch (error) {
    toast.error("エラーが発生しました");
  }
};
```

2. 権限チェックとナビゲーション
```tsx
const handleAuthorizedNavigation = async () => {
  try {
    // 権限チェック
    const hasPermission = await checkUserPermission(userId, targetResource);
    
    if (!hasPermission) {
      toast.error("アクセス権限がありません");
      return;
    }

    // 未保存の変更がある場合の確認
    if (hasUnsavedChanges) {
      const confirmed = await showConfirmDialog("未保存の変更があります。移動しますか？");
      if (!confirmed) return;
    }

    router.push("/protected-page");
  } catch (error) {
    handleError(error);
  }
};
```

3. データの事前読み込みとナビゲーション
```tsx
const handlePreloadAndNavigate = async () => {
  try {
    // ローディング状態の開始
    setIsLoading(true);

    // 次のページで必要なデータを事前に読み込む
    await Promise.all([
      prefetchUserData(userId),
      prefetchOrganizationData(orgId),
      prefetchSettings()
    ]);

    // キャッシュの更新
    await updateCache(newData);

    router.push("/dashboard");
  } catch (error) {
    toast.error("データの読み込みに失敗しました");
  } finally {
    setIsLoading(false);
  }
};
```

4. 複数の条件分岐を含むナビゲーション
```tsx
const handleConditionalNavigation = async () => {
  // ユーザーの状態チェック
  const userStatus = await getUserStatus();
  
  switch (userStatus) {
    case "NEW":
      // 新規ユーザーの場合
      router.push("/onboarding");
      break;
    case "INCOMPLETE":
      // プロフィール未完了の場合
      const lastCompletedStep = await getLastCompletedStep();
      router.push(`/profile-setup/${lastCompletedStep}`);
      break;
    case "SUSPENDED":
      // アカウント停止中の場合
      toast.error("アカウントが停止されています");
      router.push("/support");
      break;
    case "ACTIVE":
      // 通常のナビゲーション
      router.push("/dashboard");
      break;
    default:
      router.push("/error");
  }
};
```

5. 状態の同期とナビゲーション
```tsx
const handleSyncAndNavigate = async () => {
  try {
    // オフライン変更の確認
    const offlineChanges = await checkOfflineChanges();
    
    if (offlineChanges.length > 0) {
      // オフライン変更の同期
      await syncOfflineChanges(offlineChanges);
      
      // ローカルストレージのクリーンアップ
      await cleanupLocalStorage();
    }

    // グローバル状態の更新
    updateGlobalState({
      lastSyncedAt: new Date(),
      syncStatus: 'completed'
    });

    // 同期完了後のナビゲーション
    router.push("/synced-dashboard");
  } catch (error) {
    // 同期エラー時の処理
    handleSyncError(error);
    router.push("/sync-error");
  }
};
```

これらの例のように、単純なページ遷移以外の処理が必要な場合は、`onClick`とuseRouterを使用する方法が適しています。特に、APIコール、状態管理、エラーハンドリング、条件分岐などが含まれる場合は、この方法を選択することをお勧めします。