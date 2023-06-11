import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { worker } from '@uidotdev/react-query-api';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ErrorBoundary } from 'react-error-boundary';
import './index.css';

// window.GITHUB_TOKEN = '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'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5,
            useErrorBoundary: true
        },
    },
});

function QueryError({ error }) {
    return (
        <div>
            <h1>Something went wrong</h1>
            <p>{error.message}</p>
        </div>
    );
}

new Promise((res) => setTimeout(res, 100))
    .then(() =>
        worker.start({
            quiet: true,
            onUnhandledRequest: 'bypass',
        })
    )
    .then(() => {
        ReactDOM.render(
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <ErrorBoundary FallbackComponent={QueryError}>
                        <div className='container'>
                            <App />
                        </div>
                    </ErrorBoundary>
                </BrowserRouter>

                <ReactQueryDevtools />
            </QueryClientProvider>,
            document.getElementById('root')
        );
    });
