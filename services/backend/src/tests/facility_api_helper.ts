import { Address, AddressData, Facility, FacilityData, LocString, LocStringData } from "@m-cafe-app/db-models";

const initialFacilitiesLocStrings: Omit<LocStringData, 'id'>[] = [
  {
    mainStr: 'Шаварма outcorporated',
    secStr: 'Shawarma outcorporated',
  },
  {
    mainStr: 'Луччая шаварма в твоём городе!',
    secStr: 'Da beste meatrolls in yr townie!',
  },
  {
    mainStr: 'Роллы от дяди Стёпы',
  },
  {
    mainStr: 'Делаем роллы ещё длиннее',
  }
];

const initialFacilities: Omit<FacilityData, 'id' | 'nameLocId' | 'descriptionLocId' | 'addressId'>[] = [
  {
    // evrything foreign atm
  },
  {

  }
];

export const initialFacilityAddresses: Omit<AddressData, 'id'>[] = [
  {
    city: 'Горький-17',
    street: 'Ленина'
  },
  {
    city: 'Северно-Метеоритинск',
    cityDistrict: 'Микрорайон 100500Б',
    street: 'Васи Пупкина',
    region: 'Красноармейский край',
    regionDistrict: 'Метеоритинский район',
    house: '15/6А литера Б',
    entrance: 'третий подъезд снизу',
    entranceKey: 'Постучать хорошенько',
    floor: 555,
  }
];

export const initFacilities = async (facilitiesCount?: number) => {

  const addresses = await Address.bulkCreate(initialFacilityAddresses);

  const locStrings = await LocString.bulkCreate(initialFacilitiesLocStrings);

  let i = 0;

  let j = 0;

  const facilities = [];

  for (const _newFacility of initialFacilities) {
    const facility = await Facility.create({
      nameLocId: locStrings[i].id,
      descriptionLocId: locStrings[i+1].id,
      addressId: addresses[j].id
    });
    i += 2;
    j++;
    facilities.push(facility);

    if (facilitiesCount && j >= facilitiesCount) return facilities;
  }

  return facilities;
};