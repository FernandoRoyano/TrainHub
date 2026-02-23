import { AppSidebar } from "@/components/shared/app-sidebar";
import { TopBar } from "@/components/shared/top-bar";
import { OnboardingDialog } from "@/components/shared/onboarding-dialog";
import { SectionBackground } from "@/components/shared/section-background";
import { NavigationProgress } from "@/components/shared/navigation-progress";

export default function TrainerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <NavigationProgress />
      <AppSidebar />
      <SectionBackground>
        <TopBar />
        <main className="flex-1 p-6 overflow-y-auto scrollbar-thin">{children}</main>
      </SectionBackground>
      <OnboardingDialog />
    </div>
  );
}
