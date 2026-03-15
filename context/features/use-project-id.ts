import { useQuery } from "@tanstack/react-query";
import axios from "axios";

//? To get recent project by id(query)
export const useGetProjectById = (projectId: string) => {
  return useQuery({
    queryKey: ["projects", projectId],
    queryFn: async () => {
      const response = await axios.get(`/api/project/${projectId}`);
      // API returns: { success: boolean, data: project }
      // We only want the actual project object here
      return response.data?.data;
    },
    enabled: !!projectId,
  });
};
