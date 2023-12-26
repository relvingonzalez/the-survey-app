import Layout from "@/components/Layout";

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
