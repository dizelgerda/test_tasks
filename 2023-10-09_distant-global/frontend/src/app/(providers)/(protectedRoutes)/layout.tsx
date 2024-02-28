"use client";

import Header from "@components/Header";
import { getCurrentUser } from "@helpers/api/users";
import { useAppDispatch, useAppSelector } from "@helpers/store/hooks";
import { setCurrentUser } from "@helpers/store/slices/currentUser";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ReactNode, useEffect } from "react";

function getURL(pathname: string, searchParams: URLSearchParams) {
  const params = new URLSearchParams(searchParams);
  return pathname + "?" + params.toString();
}

interface ProtectedLayoutProps {
  children: ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentUser = useAppSelector((store) => store.currentUser);
  const dispatch = useAppDispatch();

  async function checkAuth() {
    try {
      const res = await getCurrentUser();
      if (res.ok) {
        dispatch(setCurrentUser(await res.json()));
      }
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (!currentUser) {
      localStorage.setItem("block_path", getURL(pathname, searchParams));
      router.push("/sign-in");
    }
  }, [currentUser]);

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
}
