function ErrorPage() {
    return (
        <div className="container flex justify-center items-center h-screen px-8">
            {/* <div role="alert" className="alert alert-error">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span>錯誤的路由</span>
      </div> */}
            <div className="w-1/2">
                <img src="https://github.com/SAWARATSUKI/KawaiiLogos/blob/main/ResponseCode/404%20NotFound.png?raw=true" alt="404 Not Found" />
            </div>
        </div>
    )
}

export default ErrorPage;