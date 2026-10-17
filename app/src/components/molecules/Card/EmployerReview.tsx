import React, { useState, useEffect } from "react";
import Image from "next/legacy/image";
import { Typography } from "@/components/atoms";
import { EmployerData } from "./Data/UserData"; // Assuming SeekerData is correctly imported from UserData
import { motion } from "framer-motion";

const EmployerReview: React.FC = () => {
  const [expanded, setExpanded] = useState<number | null>(1);
  const [selectedDescription, setSelectedDescription] = useState<string>();

  useEffect(() => {
    setSelectedDescription(
      EmployerData.find((item) => item.id === 1)?.description
    );
  }, []);

  const handleToggle = (id: number, description: string) => {
    if (expanded === id) {
      return;
    } else {
      setExpanded(id);
      setSelectedDescription(description);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="mx-auto">
          {EmployerData.map((items, index) => (
            <motion.div
              key={items.id}
              className={`w-[270px] h-[80px] lg:w-[340px] lg:h-[100px] shadow-xl flex items-center px-3 rounded-[6px] my-16 ${
                expanded === items.id ? "bg-gray-100" : ""
              } ${index === 0 || index === 2 ? "ml-20" : ""}`}
              onClick={() => handleToggle(items.id, items.description)}
              style={{ cursor: "pointer" }}
              initial={{ scale: 1 }}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center">
                <Image
                  src={items.image}
                  alt="person"
                  width={54}
                  height={54}
                  layout="fixed" // or "responsive", depending on your use case
                  objectFit="cover" // or any other appropriate value
                  className="w-[50px] h-[50px] lg:w-[60px] lg:h-[60px] flex items-center rounded-full"
                />
                <div className="ml-3">
                  <Typography>{items.name}</Typography>
                  <Typography
                    className="text-[#ADB5BD] tracking-wide"
                    fontSize="xs"
                  >
                    {items.position}
                  </Typography>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="flex justify-center items-center">
          <div className="w-[450px] h-[500px] flex justify-center items-center">
            <motion.div
              key={selectedDescription}
              className="text-[14px] lg:text-[16px] -mt-40 w-[350px] lg:w-[500px] lg:mt-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <q>{selectedDescription}</q>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployerReview;
