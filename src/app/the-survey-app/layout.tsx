import Layout from "@/components/layout";

export default function TheSurveyAppLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
  return (
    <Layout> 
      {children}
    </Layout>
  )
}
