import React from 'react'
import { useRef, useState, useEffect } from 'react';
// Added Bounce to the import list
import { ToastContainer, toast, Bounce } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import 'react-toastify/dist/ReactToastify.css';

const Manager = () => {
    const ref = useRef()
    const passwordRef = useRef()
    const [form, setform] = useState({ site: "", username: "", password: "" })
    const [passwordArray, setPasswordArray] = useState([])

    const getPasswords = async () => {
        let req = await fetch("http://localhost:3000/")
        let passwords = await req.json()
        setPasswordArray(passwords)
    }

    useEffect(() => {
        getPasswords()
    }, [])

    const copyText = (text) => {
        toast('Copied to clipboard!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce, // Corrected syntax: replaced ={Bounce} with : Bounce
        });
        navigator.clipboard.writeText(text)
    }

    const showPassword = () => {
        if (ref.current.src.includes("icons/eyecross.png")) {
            ref.current.src = "icons/eye.png"
            passwordRef.current.type = "password"
        }
        else {
            passwordRef.current.type = "text"
            ref.current.src = "icons/eyecross.png"
        }
    }

    const savePassword = async () => {
        if (form.site.length > 3 && form.username.length > 3 && form.password.length > 3) {

            // If we are editing an existing entry, delete the old one from the DB first
            if (form.id) {
                await fetch("http://localhost:3000/", { 
                    method: "DELETE", 
                    headers: { "Content-Type": "application/json" }, 
                    body: JSON.stringify({ id: form.id }) 
                })
            }

            const newId = form.id || uuidv4();
            const passwordEntry = { ...form, id: newId };

            // Update local state
            setPasswordArray([...passwordArray.filter(item => item.id !== form.id), passwordEntry])
            
            // Save to DB
            await fetch("http://localhost:3000/", { 
                method: "POST", 
                headers: { "Content-Type": "application/json" }, 
                body: JSON.stringify(passwordEntry) 
            })

            setform({ site: "", username: "", password: "" })
            toast('Password saved!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce, // Corrected syntax: replaced ={Bounce} with : Bounce
            });
        }
        else {
            toast.error('Error: Fields must be longer than 3 characters');
        }
    }

    const deletePassword = async (id) => {
        let c = confirm("Do you really want to delete this password?")
        if (c) {
            setPasswordArray(passwordArray.filter(item => item.id !== id))
            await fetch("http://localhost:3000/", { 
                method: "DELETE", 
                headers: { "Content-Type": "application/json" }, 
                body: JSON.stringify({ id }) 
            })

            toast('Password Deleted!', {
                position: "top-right",
                autoClose: 5000,
                theme: "dark",
            });
        }
    }

    const editPassword = (id) => {
        setform({ ...passwordArray.filter(i => i.id === id)[0], id: id })
        setPasswordArray(passwordArray.filter(item => item.id !== id))
    }

    const handleChange = (e) => {
        setform({ ...form, [e.target.name]: e.target.value })
    }

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]"></div>
            <div className="px-2 md:mycontainer min-h-[83.5vh]">
                <h1 className='text-4xl font-bold text-center'>
                    <span className='text-indigo-500'>&lt;</span>
                    <span className='text-violet-50'>Pass</span>
                    <span className='text-indigo-500'>OP/&gt;</span>
                </h1>
                <p className='text-violet-100 text-lg text-center'>Your own Password Manager</p>

                <div className="flex flex-col p-4 text-black gap-7 items-center">
                    <input value={form.site} onChange={handleChange} placeholder='Enter website URL' className='rounded-lg border border-indigo-800 w-full p-4 py-1' type="text" name="site" id="site" />
                    <div className="flex flex-col md:flex-row w-full justify-between gap-10">
                        <input value={form.username} onChange={handleChange} placeholder='Enter Username' className='rounded-lg border border-indigo-800 w-full p-4 py-1' type="text" name="username" id="username" />
                        <div className='relative'>
                            <input ref={passwordRef} value={form.password} onChange={handleChange} placeholder='Enter Password' className='rounded-lg border border-indigo-800 w-full p-4 py-1' type="password" name="password" id="password" />
                            <span className='absolute right-[0px] top-[5px] cursor-pointer' onClick={showPassword}>
                                <img ref={ref} className='p-1' width={26} src="icons/eye.png" alt="eye" />
                            </span>
                        </div>
                    </div>
                    <button onClick={savePassword} className='flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-400 w-fit rounded-2xl px-4 py-1 border border-indigo-400 font-bold'>
                        <lord-icon
                            src="https://cdn.lordicon.com/jgnvfzqg.json"
                            trigger="hover" >
                        </lord-icon>
                        Save
                    </button>
                </div>

                <div className="passwords">
                    <h2 className='font-bold text-xl py-4 text-white'>Your Passwords</h2>
                    {passwordArray.length === 0 && <div className='text-white'>No Passwords to Show</div>}
                    {passwordArray.length !== 0 && <table className="table-auto w-full rounded-md overflow-hidden mb-5">
                        <thead className='bg-indigo-700'>
                            <tr className='text-white'>
                                <th className='py-2'>Site</th>
                                <th className='py-2'>Username</th>
                                <th className='py-2'>Password</th>
                                <th className='py-2'>Actions</th>
                            </tr>
                        </thead>
                        <tbody className='bg-indigo-300'>
                            {passwordArray.map((item, index) => (
                                <tr key={index}>
                                    <td className='py-2 border border-white text-center'>
                                        <div className='flex items-center justify-center gap-2 text-black'>
                                            <a href={item.site} target='_blank' rel="noreferrer">{item.site}</a>
                                            <div className="lordiconCopy size-6 cursor-pointer" onClick={() => copyText(item.site)}>
                                                <lord-icon
                                                    style={{ width: "25px", height: "25px", paddingTop: "3px" }}
                                                    src="https://cdn.lordicon.com/iykgtsbt.json"
                                                    trigger="hover">
                                                </lord-icon>
                                            </div>
                                        </div>
                                    </td>
                                    <td className='py-2 border border-white text-center'>
                                        <div className='flex items-center justify-center gap-2'>
                                            <span>{item.username}</span>
                                            <div className="lordiconCopy size-6 cursor-pointer" onClick={() => copyText(item.username)}>
                                                <lord-icon
                                                    style={{ width: "25px", height: "25px", paddingTop: "3px" }}
                                                    src="https://cdn.lordicon.com/iykgtsbt.json"
                                                    trigger="hover">
                                                </lord-icon>
                                            </div>
                                        </div>
                                    </td>
                                    <td className='py-2 border border-white text-center'>
                                        <div className='flex items-center justify-center gap-2'>
                                            <span>{"*".repeat(item.password.length)}</span>
                                            <div className="lordiconCopy size-6 cursor-pointer" onClick={() => copyText(item.password)}>
                                                <lord-icon
                                                    style={{ width: "25px", height: "25px", paddingTop: "3px" }}
                                                    src="https://cdn.lordicon.com/iykgtsbt.json"
                                                    trigger="hover">
                                                </lord-icon>
                                            </div>
                                        </div>
                                    </td>
                                    <td className='py-2 border border-white text-center'>
                                        <span className='cursor-pointer mx-1 ' onClick={() => { editPassword(item.id) }}>
                                            <lord-icon
                                                src="https://cdn.lordicon.com/gwlusjdu.json"
                                                trigger="hover"
                                                style={{ "width": "25px", "height": "25px" }}>
                                            </lord-icon>
                                        </span>
                                        <span className='cursor-pointer mx-1' onClick={() => { deletePassword(item.id) }}>
                                            <lord-icon
                                                src="https://cdn.lordicon.com/skkahier.json"
                                                trigger="hover"
                                                style={{ "width": "25px", "height": "25px" }}>
                                            </lord-icon>
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>}
                </div>
            </div >
        </>
    )
}

export default Manager