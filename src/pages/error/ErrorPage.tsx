/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate, useRouteError } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Home, ArrowLeft, RefreshCcw } from 'lucide-react';

export default function ErrorPage() {
  const navigate = useNavigate();
  const error = useRouteError() as any;

  const getErrorMessage = () => {
    if (error?.status === 404) {
      return {
        title: '404 - Page Not Found',
        description: "The page you're looking for doesn't exist or has been moved.",
        suggestion: 'Please check the URL or return to the homepage.',
      };
    }

    if (error?.status === 403) {
      return {
        title: '403 - Access Denied',
        description: "You don't have permission to access this page.",
        suggestion: 'Please contact support if you believe this is an error.',
      };
    }

    if (error?.status === 500) {
      return {
        title: '500 - Server Error',
        description: 'Something went wrong on our end.',
        suggestion: 'Please try again later or contact support if the problem persists.',
      };
    }

    return {
      title: 'Oops! Something went wrong',
      description: error?.statusText || error?.message || 'An unexpected error occurred.',
      suggestion: 'Please try refreshing the page or return to the homepage.',
    };
  };

  const errorInfo = getErrorMessage();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="h-10 w-10 text-destructive" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">{errorInfo.title}</CardTitle>
          <CardDescription className="text-base">
            {errorInfo.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <p className="text-sm font-medium">What can you do?</p>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>{errorInfo.suggestion}</li>
              <li>Check your internet connection</li>
              <li>Clear your browser cache and cookies</li>
            </ul>
          </div>

          {error?.status && (
            <div className="bg-muted/30 rounded-lg p-4">
              <p className="text-xs font-mono text-muted-foreground">
                Error Code: {error.status}
                {error.statusText && ` - ${error.statusText}`}
              </p>
            </div>
          )}

          <div className="grid sm:grid-cols-3 gap-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleGoBack}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleRefresh}
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button
              className="w-full"
              onClick={handleGoHome}
            >
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
          </div>

          <div className="text-center pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Need help?{' '}
              <a
                href="/support"
                className="text-primary hover:underline font-medium"
              >
                Contact Support
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}