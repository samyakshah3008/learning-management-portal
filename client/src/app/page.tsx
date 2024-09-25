"use client";

import Header from "@/components/layouts/header";
import Heading from "@/components/layouts/heading";
import Hero from "@/components/layouts/hero";
import { FC, useState } from "react";
interface Props {}

const Home: FC<Props> = (props) => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <Heading
        title="PomoSuperLearn"
        description="One stop platform to sell and buy courses to watch"
        keywords="NextJS"
      />
      <Header open={open} setOpen={setOpen} activeItem={10} />
      <Hero />
    </div>
  );
};

export default Home;
