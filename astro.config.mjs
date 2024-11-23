// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: "Aero 開発ドキュメント",
			social: {
				github: "https://github.com/withastro/starlight",
			},
			sidebar: [
				{
					// @sync-start: common-section
					// 同期する範囲を指定するための記述なのでこのコメントは削除しない
					label: "【共通】開発の考え方",
					collapsed: true,
					items: [
						{
							label: "はじめに",
							link: "/common",
						},
						{
							label: "セットアップ",
							autogenerate: {
								directory: "common/setup",
							},
						},
						{
							label: "基本方針",
							autogenerate: {
								directory: "common/basic-policy",
							},
						},
						{
							label: "プロダクト",
							autogenerate: { directory: "common/product" },
						},
						{
							label: "デザイン",
							autogenerate: { directory: "common/design" },
						},
						{
							label: "技術スタック",
							collapsed: true,
							items: [
								{
									label: "概要",
									link: "/common/tech-stack",
								},
								{
									label: "Next.js",
									autogenerate: { directory: "common/tech-stack/nextjs" },
								},
								{
									label: "React",
									autogenerate: { directory: "common/tech-stack/react" },
								},
								{
									label: "Tailwind CSS",
									autogenerate: { directory: "common/tech-stack/tailwindcss" },
								},
								{
									label: "shadcn/ui",
									autogenerate: { directory: "common/tech-stack/shadcn-ui" },
								},
								{
									label: "TypeScript",
									autogenerate: { directory: "common/tech-stack/typescript" },
								},
								{
									label: "Astro",
									autogenerate: { directory: "common/tech-stack/astro" },
								},
								{
									label: "Starlight",
									autogenerate: { directory: "common/tech-stack/starlight" },
								},
							],
						},
						{
							label: "コーディング規約",
							autogenerate: {
								directory: "common/coding",
							},
						},
						{
							label: "Lintとフォーマット",
							autogenerate: { directory: "common/lint-format" },
						},
						{
							label: "開発フロー",
							autogenerate: { directory: "common/development-flow" },
						},

						{
							label: "FAQ",
							collapsed: true,
							autogenerate: { directory: "common/faq" },
						},
					],
					// 同期する範囲を指定するための記述なのでこのコメントは削除しない
					// @sync-end: common-section
				},
				{
					label: "【Aero】開発ガイドライン",
					collapsed: false,
					items: [
						{
							label: "はじめに",
							link: "/guides",
						},
						{
							label: "技術スタック",
							autogenerate: { directory: "guides/tech-stack" },
						},
						{
							label: "ディレクトリ構造",
							autogenerate: { directory: "guides/structure" },
						},
						{
							label: "機能",
							autogenerate: { directory: "guides/features" },
						},
						{
							label: "処理",
							autogenerate: { directory: "guides/process" },
						},
						{
							label: "UI/UX",
							autogenerate: { directory: "guides/ui-ux" },
						},
						{
							label: "データベース",
							autogenerate: { directory: "guides/database" },
						},
						{
							label: "ドキュメント",
							autogenerate: { directory: "guides/docs" },
						},
					],
				},
				{
					label: "【Aero】用件定義",
					collapsed: false,
					autogenerate: { directory: "requirements" },
				},
			],
		}),
	],
});
