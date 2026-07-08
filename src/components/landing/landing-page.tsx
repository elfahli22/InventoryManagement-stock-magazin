"use client";

import { useState } from "react";
import Link from "next/link";
import { Store, Package, BarChart3, Shield, Warehouse, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { demoLoginAction } from "@/lib/actions/auth.actions";

export function LandingPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleDemoLogin() {
    setLoading(true);
    setError("");
    const result = await demoLoginAction();
    if (result.success) {
      window.location.href = "/dashboard";
    } else {
      setError(result.error || "Demo login failed");
      setLoading(false);
    }
  }

  const features = [
    {
      icon: Package,
      title: "Inventory Tracking",
      description: "Real-time stock management with automated tracking",
    },
    {
      icon: Warehouse,
      title: "Stock Control",
      description: "Manage stock-in, stock-out, and adjustments",
    },
    {
      icon: BarChart3,
      title: "Reports & Analytics",
      description: "Comprehensive reports and performance insights",
    },
    {
      icon: Shield,
      title: "Role-Based Access",
      description: "Granular permissions for your team",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background/95 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Store className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold tracking-tight">InventoryManager</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-24 lg:py-32">
          <div className="container mx-auto px-4 text-center space-y-8 max-w-4xl">
            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight">
              Premium Inventory Management
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Track, manage, and optimize your inventory with a powerful,
              role-based management system built for modern businesses.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button size="lg" className="w-full sm:w-auto min-w-[200px]" onClick={handleDemoLogin} disabled={loading}>
                {loading ? "Loading..." : "Explore Demo"}
                {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto min-w-[200px]" asChild>
                <Link href="/register">Create Account</Link>
              </Button>
            </div>
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>
        </section>

        <section className="py-24 bg-muted/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-16">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="bg-background rounded-xl p-6 border shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} InventoryManager. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}