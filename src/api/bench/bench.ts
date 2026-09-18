import apiClient from "../../lib/api";
import { ENDPOINTS } from "../../utils/apiendpoint";

export async function getBenchList(): Promise<any[]> {
  try {
    let response;
    try {
      response = await apiClient.get(`${ENDPOINTS.benchEmployee}?sort=id&direction=ASC`);
    } catch {
      response = await apiClient.get(`${ENDPOINTS.employee}?sort=id&direction=ASC`);
    }
    const data = response?.data;
    const list = Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data?.data?.content)
      ? data.data.content
      : Array.isArray(data)
      ? data
      : [];

    return list.map((emp: any) => {
      const avail = (emp.availability !== undefined && emp.availability !== null) ? Number(emp.availability) : 100;
      const joinDate = emp.joinDate || "2026-01-01";
      const currentYear = new Date().getFullYear();
      const period = `${joinDate} to ${currentYear}-12-31`;
      const isActive = emp.isActive !== undefined ? Boolean(emp.isActive) : true;

      return {
        id: String(emp.id),
        employeeId: emp.id,
        userId: emp.userId || emp.id,
        firstName: emp.firstName || "",
        lastName: emp.lastName || "",
        email: emp.email || "",
        phone: emp.contactNo || "",
        contactNo: emp.contactNo || "",
        designation: emp.designationName || "",
        designationName: emp.designationName || "",
        skills: emp.skills || [],
        experience: emp.experience || 0,
        availability: isNaN(avail) ? 100 : avail,
        availabilityPercent: isNaN(avail) ? 100 : avail,
        availabilityPeriod: period,
        benchStartDate: joinDate,
        benchEndDate: `${currentYear}-12-31`,
        active: isActive,
        isActive: isActive,
        status: isActive ? "Active" : "Inactive",
        employee: {
          id: emp.id,
          firstName: emp.firstName || "",
          lastName: emp.lastName || "",
          email: emp.email || "",
          contactNo: emp.contactNo || "",
          phone: emp.contactNo || "",
          designationName: emp.designationName || "",
          active: isActive,
          isActive: isActive,
          availability: isNaN(avail) ? 100 : avail,
          joinDate: joinDate,
        },
      };
    });
  } catch (err) {
    console.error("Error fetching bench list:", err);
    return [];
  }
}

export const getViewAllocation = async (userId: string) => {
  try {
    const benchList = await getBenchList();
    const emp = benchList.find((u) => String(u.id) === String(userId));
    const avail = emp?.availability ?? 100;
    const currentYear = new Date().getFullYear();
    return {
      data: {
        availablePeriods: [
          {
            period: emp?.availabilityPeriod || `2026-01-01 to ${currentYear}-12-31`,
            percentage: avail,
            project: "Bench Resource",
            userId: Number(userId),
          },
        ],
      },
    };
  } catch {
    return {
      data: {
        availablePeriods: [],
      },
    };
  }
};

export async function getEmployeeDetails(id: string): Promise<any> {
  try {
    const res = await apiClient.get(ENDPOINTS.employeeById(Number(id)));
    const emp = res.data?.data || res.data;
    if (emp) {
      return {
        ...emp,
        availability: emp.availability ?? 100,
        availabilityPercent: emp.availability ?? 100,
      };
    }
  } catch (e) {
    console.error("Failed to fetch employee details by id:", e);
  }
  const benchList = await getBenchList();
  return benchList.find((u) => String(u.id) === String(id));
}

export const getBenchAvailability = async (
  page: number = 0,
  size: number = 5,
  filters: any = {}
) => {
  try {
    const benchList = await getBenchList();
    let bench = benchList.filter((u) => (u.availability ?? 100) > 0);

    if (filters.designation) {
      bench = bench.filter((u) =>
        (u.designationName || u.designation || "")
          .toLowerCase()
          .includes(String(filters.designation).toLowerCase())
      );
    }
    if (filters.minAvailable) {
      bench = bench.filter(
        (u) => (u.availability ?? 100) >= Number(filters.minAvailable)
      );
    }
    if (filters.search) {
      const q = String(filters.search).toLowerCase();
      bench = bench.filter(
        (u) =>
          `${u.firstName} ${u.lastName}`.toLowerCase().includes(q) ||
          (u.email && u.email.toLowerCase().includes(q))
      );
    }

    const start = page * size;
    const paged = bench.slice(start, start + size);

    return {
      status: "success",
      statusCode: 200,
      data: {
        content: paged.map((u) => ({
          id: u.id,
          employeeId: u.id,
          userId: u.userId || u.id,
          firstName: u.firstName,
          lastName: u.lastName,
          email: u.email || "",
          contactNo: u.phone || u.contactNo || "",
          designation: u.designationName || u.designation || "",
          designationName: u.designationName || u.designation || "",
          skills: u.skills || [],
          experience: u.experience || 0,
          availability: u.availability ?? 100,
          status:
            (u.availability ?? 100) === 100 ? "Available" : "Partially Allocated",
          benchStartDate: u.benchStartDate || "2026-01-01",
          benchEndDate: u.benchEndDate || "2026-12-31",
          availabilityPeriod: u.availabilityPeriod || "2026-01-01 to 2026-12-31",
          active: true,
          isActive: true,
          employee: {
            id: u.id,
            firstName: u.firstName,
            lastName: u.lastName,
            email: u.email || "",
            contactNo: u.phone || u.contactNo || "",
            designationName: u.designationName || u.designation || "",
            active: true,
            isActive: true,
            availability: u.availability ?? 100,
          },
        })),
        totalElements: bench.length,
        totalPages: Math.ceil(bench.length / size),
        size,
        number: page,
      },
    };
  } catch (err) {
    return {
      status: "error",
      statusCode: 500,
      data: {
        content: [],
        totalElements: 0,
        totalPages: 0,
        size,
        number: page,
      },
    };
  }
};

export const getEmployeeProjectHistory = async (userId: string) => {
  try {
    const res = await apiClient.get(ENDPOINTS.projectAllocationByEmployee(Number(userId)));
    return {
      data: res.data?.data || res.data || [],
    };
  } catch {
    return {
      data: [],
    };
  }
};