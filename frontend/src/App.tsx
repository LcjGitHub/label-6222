import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { DesignerSummaryPage } from "@/pages/DesignerSummaryPage";
import { IssueDetailPage } from "@/pages/IssueDetailPage";
import { IssueListPage } from "@/pages/IssueListPage";
import { OverviewPage } from "@/pages/OverviewPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
});

/** 应用根组件 */
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <Navbar />
          <Routes>
            <Route path="/" element={<IssueListPage />} />
            <Route path="/overview" element={<OverviewPage />} />
            <Route path="/designers" element={<DesignerSummaryPage />} />
            <Route path="/issues/:id" element={<IssueDetailPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
