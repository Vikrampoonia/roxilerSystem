function LoadingSpinner() {
    return (
        <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-4">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-300/30 border-t-cyan-300"></div>
                <p className="text-sm text-slate-400">Loading...</p>
            </div>
        </div>
    );
}

export default LoadingSpinner;
