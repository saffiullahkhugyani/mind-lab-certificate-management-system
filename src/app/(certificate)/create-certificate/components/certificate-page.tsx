"use client";

import { useEffect, useState } from "react";
import CreateCertificate from "./create-certificate-form";
import SearchCertificate from "./search-certificate-form";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Certificate, FormattedSkillTags } from "@/types/types";
import { SkillTags, SkillType } from "@/types/customs";

// props types
interface CertificatePageProps {
  certificates: Certificate[] | null;
  skillType: Array<SkillType>;
  skillTags: Array<FormattedSkillTags>;
}

// Main certificate page responsible for displaying and managing states for search and add certificates
const CertificatePage = ({
  certificates,
  skillTags,
  skillType,
}: CertificatePageProps) => {
  const [addCertificate, setAddCertificate] = useState(true);
  const [onSearch, setOnSearch] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [listData, setListData] = useState<Certificate[]>([]);
  const [selectedCertificate, setSelectedCertificate] =
    useState<Certificate | null>(null);
  const [searchString, setSearchString] = useState<string>("");

  // function for handinling add certificate from exisiting certificate
  const handleOnAddCertificate = (data: Certificate | null) => {
    // logic to add certificate
    setSelectedCertificate(data);
    setIsSearchOpen(false);
    setAddCertificate(false);
  };

  // function for fetching data and asingnig it to a list
  const fetchCertificates = (searchQuery: string) => {
    setSearchString(searchQuery);
    try {
      const data = certificates;
      setListData(data!);
    } catch (error) {
      console.error("error fetching data", error);
    }
  };

  // trigget for fetching data function
  useEffect(() => {
    if (onSearch) {
      fetchCertificates(onSearch);
    }
  }, [onSearch]);

  // disabling form
  useEffect(() => {
    setAddCertificate(true);
  }, [certificates]);

  return (
    <>
      <ResponsiveDialog
        isOpen={isSearchOpen}
        setIsOpen={setIsSearchOpen}
        title="Search Certificate"
      >
        <DataTable
          columns={columns()}
          data={listData}
          searchInitial={searchString}
          onAddCertificate={handleOnAddCertificate}
        />
      </ResponsiveDialog>
      <div className="container ">
        {/* Section 1: Search */}
        <SearchCertificate
          searchString={setOnSearch}
          openSearch={setIsSearchOpen}
        />
        {/* Section 2: Certificate Details */}
        <CreateCertificate
          certificate={selectedCertificate!}
          skillTags={skillTags}
          skillType={skillType}
          disabled={addCertificate}
        />
      </div>
    </>
  );
};

export default CertificatePage;
