const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
export function getToken(){ return localStorage.getItem("skillsync_token"); }
export function setSession(token,user){ localStorage.setItem("skillsync_token",token); localStorage.setItem("skillsync_user",JSON.stringify(user)); }
export function clearSession(){ localStorage.removeItem("skillsync_token"); localStorage.removeItem("skillsync_user"); }
export function getStoredUser(){ try{return JSON.parse(localStorage.getItem("skillsync_user")||"null")}catch{return null} }
export async function api(path, options={}) {
  const token=getToken();
  const res=await fetch(`${API}${path}`,{...options,headers:{"Content-Type":"application/json",...(token?{Authorization:`Bearer ${token}`} : {}),...(options.headers||{})}});
  const data=await res.json().catch(()=>({message:"Unexpected server response"}));
  if(!res.ok) throw new Error(data.message||"Request failed");
  return data;
}
