import React from 'react'
import { HiOutlineUserGroup } from 'react-icons/hi'

function MainHead() {
  return (
    <section className="bg-blue-600 py-20 mb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
            <div className="bg-white/20 p-4 rounded-full mb-6">
                <HiOutlineUserGroup className="text-white text-5xl" />
            </div>
            <div className="text-center">
                <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
                    Jan Seva
                </h1>
                <p className="my-4 text-xl text-white">
                    A platform for citizens to report and resolve civic issues in their community.
                </p>
            </div>
        </div>
    </section>
  )
}

export default MainHead
