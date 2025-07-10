import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import type React from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        // backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://unsplash.com/photos/LJh9ayGO8t8/download?ixid=M3wxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNzUxODE4MzUzfA&force=true&w=1920')`,
        backgroundImage: `linear-gradient(#fcba0333, #4991de33), url('/auth-layout-bg.jpg')`,
      }}
    >
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="h-8 w-8 bg-gradient-to-br from-green-400 to-blue-600 rounded-sm flex items-center justify-center">
              <span className="text-white text-sm font-bold">L</span>
            </div>
            <span className="ml-2 text-xl font-bold">Lightmark</span>
          </div>
          <CardDescription>
            {/* Take note whatever stirs your soul — a color that lifts your
            spirits, sunlight slipping through a crack in the door, or the
            fleeting hue of a drifting puff of smoke. */}
            Let your soul be stirred by what others walk past. <br />
            Write it down, draw it, hold it. Even the briefest hue of drifting
            smoke can become a memory — not of what happened, but of what
            mattered.
          </CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
}
