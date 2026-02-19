import { AppSidebar } from "@/components/shared/app-sidebar";
import { TopBar } from "@/components/shared/top-bar";
import { OnboardingDialog } from "@/components/shared/onboarding-dialog";
import { SectionBackground } from "@/components/shared/section-background";

export default function TrainerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <SectionBackground>
        <TopBar />
        <main className="flex-1 p-6 overflow-y-auto scrollbar-thin">{children}</main>
      </SectionBackground>
      <OnboardingDialog />
    </div>
  );
}
