import { APP_NAME, DISCLAIMER } from '@/constants';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/50">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 text-center">
          {/* Website Name */}
          <p className="text-lg font-medium">{APP_NAME}</p>

          {/* Disclaimer */}
          <p className="text-sm text-muted-foreground">{DISCLAIMER}</p>

          {/* Copyright */}
          <p className="text-xs text-muted-foreground">
            © {currentYear} {APP_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
