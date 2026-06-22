import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { DesignerSummaryPage } from "@/pages/DesignerSummaryPage";
import { IssueDetailPage } from "@/pages/IssueDetailPage";
import { IssueListPage } from "@/pages/IssueListPage";

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
        <Routes>
          <Route path="/" element={<IssueListPage />} />
          <Route path="/designers" element={<DesignerSummaryPage />} />
          <Route path="/issues/:id" element={<IssueDetailPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
