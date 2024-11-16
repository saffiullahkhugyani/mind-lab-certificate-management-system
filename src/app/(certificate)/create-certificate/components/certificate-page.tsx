"use client";

import { useEffect, useState } from "react";
import CreateCertificate from "./create-certificate-form";
import SearchCertificate from "./search-certificate-form";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import {
  Certificate,
  CustomUploadedCertificate,
  FormattedSkillTags,
} from "@/types/types";
import { SkillType } from "@/types/customs";
import UploadedCertificates from "./uploaded-certificates";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

// props types
interface CertificatePageProps {
  certificates: Certificate[] | null;
  skillType: Array<SkillType>;
  skillTags: Array<FormattedSkillTags>;
  uploadedCertificates: CustomUploadedCertificate[] | null;
}

// Main certificate page responsible for displaying and managing states for search and add certificates
const CertificatePage = ({
  certificates,
  skillTags,
  skillType,
  uploadedCertificates,
}: CertificatePageProps) => {
  const [addCertificate, setAddCertificate] = useState(true);
  const [onSearch, setOnSearch] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [listData, setListData] = useState<Certificate[]>([]);
  const [selectedCertificate, setSelectedCertificate] =
    useState<Certificate | null>(null);
  const [searchString, setSearchString] = useState<string>("");
  const [certificateAssertion, setCertificateAssertion] = useState(false);
  const [selectedV1Certificate, setSelectedV1Certificate] =
    useState<CustomUploadedCertificate | null>(null);

  // hooks for edit/updating certificate
  // using same hook for selected certificate for edit
  const searchParams = useSearchParams();
  const [isEdit, setIsEdit] = useState(false);

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

  useEffect(() => {
    // Get the values from search params
    const isEditParam = searchParams.get("isEdit");
    const certificateDataParam = searchParams.get("certificateData");

    // Log the raw values from search params
    console.log("Raw isEdit:", isEditParam);
    console.log("Raw certificateData:", certificateDataParam);

    // Parse the values safely
    if (isEditParam) setIsEdit(JSON.parse(isEditParam));
    else setIsEdit(false);

    if (certificateDataParam)
      setSelectedCertificate(
        JSON.parse(decodeURIComponent(certificateDataParam))
      );
    else setSelectedCertificate(null);
  }, [searchParams]);

  return (
    <>
      {!isEdit && (
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
      )}
      <div className="container ">
        {/* Section zero uploaded sertificates from students */}

        {!isEdit && (
          <UploadedCertificates
            uploadedCertificates={uploadedCertificates}
            setCertificateUrl={setSelectedV1Certificate}
            setCertificateImageDisplay={setCertificateAssertion}
          />
        )}
        {/* Section 1: Search */}
        {!isEdit && (
          <SearchCertificate
            searchString={setOnSearch}
            openSearch={setIsSearchOpen}
          />
        )}
        {/* Section 2: Certificate Details */}
        <div className="flex flex-row">
          <div className="w-full">
            <CreateCertificate
              certificate={selectedCertificate!} // to add data from v2 existing certificate
              v1Certificate={selectedV1Certificate} // for mapping version 1 certificate with version 2 certificate
              skillTags={skillTags}
              skillType={skillType}
              disabled={!isEdit ? addCertificate : false}
              isEdit={isEdit}
              buttonLabel={isEdit ? "Update Certificate" : "Add Certificate"}
            />
          </div>
          {/* {certificateAssertion && (
            <div className="w-full flex items-center justify-center bg-white p-2 m-2 rounded-sm shadow-md">
              <Image
                src={selectedV1Certificate?.certificate_image_url!}
                alt=" -Certificate Image"
                width={500}
                height={200}
              />
            </div>
          )} */}
        </div>
      </div>
    </>
  );
};

export default CertificatePage;
