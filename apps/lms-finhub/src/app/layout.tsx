import React from 'react'

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <html lang="en">
            <body>
                <div id="zoom-app">
                    {children}
                </div>
            </body>
        </html>
    )
}

export default Layout