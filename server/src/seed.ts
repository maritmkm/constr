import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';
import { Admin } from './models/Admin.js';
import { Location } from './models/Location.js';
import { JobType } from './models/JobType.js';
import { Company } from './models/Company.js';
import { Employee } from './models/Employee.js';
import { OngoingWork } from './models/OngoingWork.js';

const seed = async () => {
  try {
    await connectDB();
    console.log('Seeding database...');

    // 1. Admin
    await Admin.deleteMany({});
    const passwordHash = await bcrypt.hash(env.ADMIN_PASSWORD, 10);
    await Admin.create({
      name: 'System Admin',
      email: env.ADMIN_EMAIL.toLowerCase(),
      passwordHash,
    });
    console.log(`✓ Admin user created (${env.ADMIN_EMAIL})`);

    // 2. Locations
    await Location.deleteMany({});
    const locationsData = [
      { name: 'Chennai' },
      { name: 'Mumbai' },
      { name: 'Bangalore' },
      { name: 'Hyderabad' },
      { name: 'Delhi NCR' },
      { name: 'Pune' },
    ];
    const createdLocations = await Location.insertMany(locationsData);
    console.log(`✓ Created ${createdLocations.length} locations`);

    const chennai = createdLocations.find((l) => l.name === 'Chennai')!._id;
    const mumbai = createdLocations.find((l) => l.name === 'Mumbai')!._id;
    const bangalore = createdLocations.find((l) => l.name === 'Bangalore')!._id;
    const hyderabad = createdLocations.find((l) => l.name === 'Hyderabad')!._id;

    // 3. Job Types
    await JobType.deleteMany({});
    const jobTypesData = [
      { name: 'Electrician', description: 'High & Low Voltage Electrical Installations', status: 'ACTIVE' },
      { name: 'Mechanic', description: 'Heavy Machinery & Engine Maintenance', status: 'ACTIVE' },
      { name: 'Plumber', description: 'Industrial Piping & Plumbing Systems', status: 'ACTIVE' },
      { name: 'Carpenter', description: 'Formwork & Wood Framing Specialists', status: 'ACTIVE' },
      { name: 'Painter', description: 'Surface Preparation & Industrial Painting', status: 'ACTIVE' },
      { name: 'Welder', description: 'Arc, TIG & MIG Structural Welding', status: 'ACTIVE' },
      { name: 'Technician', description: 'HVAC & Control Systems Support', status: 'ACTIVE' },
    ];
    const createdJobTypes = await JobType.insertMany(jobTypesData);
    console.log(`✓ Created ${createdJobTypes.length} job types`);

    const electrician = createdJobTypes.find((j) => j.name === 'Electrician')!._id;
    const mechanic = createdJobTypes.find((j) => j.name === 'Mechanic')!._id;
    const plumber = createdJobTypes.find((j) => j.name === 'Plumber')!._id;
    const welder = createdJobTypes.find((j) => j.name === 'Welder')!._id;
    const technician = createdJobTypes.find((j) => j.name === 'Technician')!._id;

    // 4. Companies
    await Company.deleteMany({});
    const companiesData = [
      {
        companyName: 'Apex Infrastructures',
        companyType: 'Commercial Construction',
        locationId: chennai,
        ownerName: 'Rajesh Sharma',
        address: '102 Mount Road, Guindy, Chennai',
        phoneNumber: '+91 98765 43210',
        alternativePhoneNumber: '+91 44 2233 4455',
      },
      {
        companyName: 'Horizon Steel Works',
        companyType: 'Industrial Manufacturing',
        locationId: mumbai,
        ownerName: 'Sunil Mehta',
        address: '45 MIDC Industrial Zone, Andheri East, Mumbai',
        phoneNumber: '+91 98200 11223',
      },
      {
        companyName: 'Stellar Tech Parks',
        companyType: 'IT Real Estate & Facilities',
        locationId: bangalore,
        ownerName: 'Ananya Reddy',
        address: '88 Outer Ring Road, Whitefield, Bangalore',
        phoneNumber: '+91 99000 88776',
      },
      {
        companyName: 'Nexus Energy Solutions',
        companyType: 'Renewables & Power Plant',
        locationId: hyderabad,
        ownerName: 'Vikram Verma',
        address: '12 Gachibowli Tech Campus, Hyderabad',
        phoneNumber: '+91 97000 55443',
      },
    ];
    const createdCompanies = await Company.insertMany(companiesData);
    console.log(`✓ Created ${createdCompanies.length} companies`);

    const apexComp = createdCompanies.find((c) => c.companyName === 'Apex Infrastructures')!;
    const horizonComp = createdCompanies.find((c) => c.companyName === 'Horizon Steel Works')!;
    const stellarComp = createdCompanies.find((c) => c.companyName === 'Stellar Tech Parks')!;

    // 5. Employees
    await Employee.deleteMany({});
    const employeesData = [
      {
        name: 'Arun Kumar',
        phoneNumber: '+91 91234 56789',
        locationId: chennai,
        address: '14 Gandhi Street, Tambaram, Chennai',
        status: 'ACTIVE',
        jobTypeId: electrician,
      },
      {
        name: 'Ravi Kumar',
        phoneNumber: '+91 92345 67890',
        locationId: chennai,
        address: '88 Trunk Road, Porur, Chennai',
        status: 'ACTIVE',
        jobTypeId: mechanic,
      },
      {
        name: 'Suresh Kumar',
        phoneNumber: '+91 93456 78901',
        locationId: mumbai,
        address: '23 Linking Road, Bandra, Mumbai',
        status: 'ACTIVE',
        jobTypeId: plumber,
      },
      {
        name: 'Kumar Swamy',
        phoneNumber: '+91 94567 89012',
        locationId: chennai,
        address: '5 Annanagar 2nd Street, Chennai',
        status: 'ACTIVE',
        jobTypeId: electrician,
      },
      {
        name: 'Manoj Bajpayee',
        phoneNumber: '+91 95678 90123',
        locationId: mumbai,
        address: '12 Powai Lake Road, Mumbai',
        status: 'ACTIVE',
        jobTypeId: welder,
      },
      {
        name: 'Deepak Verma',
        phoneNumber: '+91 96789 01234',
        locationId: bangalore,
        address: '99 Electronic City Phase 1, Bangalore',
        status: 'ACTIVE',
        jobTypeId: technician,
      },
      {
        name: 'Karthik Raja',
        phoneNumber: '+91 97890 12345',
        locationId: chennai,
        address: '77 Velachery Main Road, Chennai',
        status: 'ON_LEAVE',
        jobTypeId: plumber,
      },
    ];
    const createdEmployees = await Employee.insertMany(employeesData);
    console.log(`✓ Created ${createdEmployees.length} employees`);

    const empArun = createdEmployees.find((e) => e.name === 'Arun Kumar')!;
    const empRavi = createdEmployees.find((e) => e.name === 'Ravi Kumar')!;
    const empSuresh = createdEmployees.find((e) => e.name === 'Suresh Kumar')!;
    const empKumar = createdEmployees.find((e) => e.name === 'Kumar Swamy')!;
    const empManoj = createdEmployees.find((e) => e.name === 'Manoj Bajpayee')!;
    const empDeepak = createdEmployees.find((e) => e.name === 'Deepak Verma')!;

    // 6. Ongoing Works & History
    await OngoingWork.deleteMany({});

    const today = new Date();
    const startDate1 = new Date(today);
    startDate1.setDate(today.getDate() - 5);
    const endDate1 = new Date(today);
    endDate1.setDate(today.getDate() + 10);

    const startDate2 = new Date(today);
    startDate2.setDate(today.getDate() - 20);
    const endDate2 = new Date(today);
    endDate2.setDate(today.getDate() - 2);

    await OngoingWork.create([
      {
        companyId: apexComp._id,
        locationId: chennai,
        overallStartDate: startDate1,
        overallEndDate: endDate1,
        status: 'ONGOING',
        employees: [
          {
            employeeId: empArun._id,
            jobTypeId: electrician,
            employeeNameSnapshot: empArun.name,
            jobTypeNameSnapshot: 'Electrician',
            startDate: startDate1,
            endDate: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000),
            status: 'ASSIGNED',
            assignedAt: startDate1,
          },
          {
            employeeId: empRavi._id,
            jobTypeId: mechanic,
            employeeNameSnapshot: empRavi.name,
            jobTypeNameSnapshot: 'Mechanic',
            startDate: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000),
            endDate: endDate1,
            status: 'ASSIGNED',
            assignedAt: startDate1,
          },
        ],
      },
      {
        companyId: horizonComp._id,
        locationId: mumbai,
        overallStartDate: startDate1,
        overallEndDate: endDate1,
        status: 'ONGOING',
        employees: [
          {
            employeeId: empSuresh._id,
            jobTypeId: plumber,
            employeeNameSnapshot: empSuresh.name,
            jobTypeNameSnapshot: 'Plumber',
            startDate: startDate1,
            endDate: endDate1,
            status: 'ASSIGNED',
            assignedAt: startDate1,
          },
          {
            employeeId: empManoj._id,
            jobTypeId: welder,
            employeeNameSnapshot: empManoj.name,
            jobTypeNameSnapshot: 'Welder',
            startDate: startDate1,
            endDate: endDate1,
            status: 'ASSIGNED',
            assignedAt: startDate1,
          },
        ],
      },
      {
        companyId: stellarComp._id,
        locationId: bangalore,
        overallStartDate: startDate2,
        overallEndDate: endDate2,
        status: 'COMPLETED',
        employees: [
          {
            employeeId: empDeepak._id,
            jobTypeId: technician,
            employeeNameSnapshot: empDeepak.name,
            jobTypeNameSnapshot: 'Technician',
            startDate: startDate2,
            endDate: endDate2,
            status: 'COMPLETED',
            assignedAt: startDate2,
          },
        ],
      },
    ]);

    console.log('✓ Created initial ongoing & completed works');
    console.log('\nSeed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
