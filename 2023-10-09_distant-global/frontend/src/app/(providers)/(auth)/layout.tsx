"use client";

import { getCurrentUser } from "@helpers/api/users";
import { useAppDispatch, useAppSelector } from "@helpers/store/hooks";
import { setCurrentUser } from "@helpers/store/slices/currentUser";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const router = useRouter();
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
    if (currentUser) {
      const blockPath = localStorage.getItem("block_path");
      router.push(blockPath ?? "/");

      setTimeout(() => localStorage.removeItem("block_path"), 10 * 1000);
    } else {
      checkAuth();
    }
  }, [currentUser]);

  return (
    <Container className="mt-5">
      <Row>
        <Col>{children}</Col>
      </Row>
    </Container>
  );
}
