import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ChatContainer from './ChatContainer'
import NoChatSelected from './NoChatSelected'
import Sidebar from './Sidebar'
import { fetchUnreadMessages } from '../store/chatSlice'

function Home() {
    const { selectedUser } = useSelector((state) => state.chats)
    const { authUser } = useSelector((state) => state.authenticate)
    const sidebar = useSelector((state) => state.sidebar)
    const dispatch = useDispatch()
    useEffect(() => {
        (async () => {
            await dispatch(fetchUnreadMessages())
        })()
    }, [])
    return (
        <div className="h-screen bg-base-200">
            <div className="flex items-center justify-center pt-20 px-4">
                <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
                    <div className="flex h-full rounded-lg overflow-hidden">
                        {sidebar && <Sidebar />}
                        {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home