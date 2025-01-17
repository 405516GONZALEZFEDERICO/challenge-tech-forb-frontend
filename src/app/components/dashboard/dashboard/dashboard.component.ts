import { Component, HostListener, inject, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../../services/login-service/auth.service';
import { NavbarComponent } from "../../navbar/navbar/navbar.component";
import { DashboardService } from '../../../services/dashboard/dashboard.service';
import { CountryEnvironmentalData, GetPlantFlagDto, Plant } from '../../../interfaces/dasboard';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [NavbarComponent, ReactiveFormsModule, CommonModule],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css','./dashboard2.component.css'] 
})
export class DashboardComponent implements OnInit, OnDestroy {
    private dashboardService = inject(DashboardService);
    private authService = inject(AuthService);
    plants?: GetPlantFlagDto[];
    private subscriptions: Subscription[] = [];
    clectures: number = 0;
    cmedAlerts: number = 0;
    credAlerts: number = 0;
    csensorsDisabled: number = 0;
    isDropdownOpen: any;
    userName: string = '';
    activeDropdownIndex: number | null = null;
    metrics?: CountryEnvironmentalData[] = [];
    selectedCountryData: CountryEnvironmentalData | undefined;
    lFlag: String = "";
    sCountry: String = "";
    sName: String = "";
    isPopupVisible?: boolean;
    plant?:Plant;

    plantForm: FormGroup = new FormGroup({
        namePlant: new FormControl('', [Validators.required,Validators.minLength(3)]),
        country: new FormControl('', [Validators.required])
    });


    closePopup(): void {
        this.isPopupVisible = false;

    }
    onTogglePopCreate() {
        this.isPopupVisible = true;

    }

    onSubmit(): void {
        if (this.plantForm.valid) {
            const formData = {
                name: this.plantForm.value.namePlant,
                country: this.plantForm.value.country
            };
        
            const createSubscription = this.dashboardService.createPlant(formData).subscribe({
                next: (newPlant) => {
                    console.log('Planta creada con éxito:', newPlant);
                    this.plantForm.reset();
                    this.closePopup();
                },
                error: (err) => {
                    console.error('Error al crear la planta', err);
                }
            });
    
            // Agregar la suscripción al array de suscripciones
            this.subscriptions.push(createSubscription);
        } else {
            console.log('Formulario no válido');
        }
    }
    
    


    @HostListener('document:click', ['$event'])
    closeDropdowns(event: MouseEvent): void {
        if (!event.target || !(event.target as Element).closest('.dropdown')) {
            this.activeDropdownIndex = null;
        }
    }

    toggleDropdown(event: MouseEvent, index: number): void {
        event.stopPropagation();
        this.activeDropdownIndex = this.activeDropdownIndex === index ? null : index;
    }

    onModifyClick(plant: GetPlantFlagDto): void {
        console.log('Modificar planta:', plant);
        this.activeDropdownIndex = null;
    }

    onDeleteClick(plant: GetPlantFlagDto): void {
        console.log('Eliminar planta:', plant);
        this.activeDropdownIndex = null;
    }






    calculateTotals(): void {
        this.plants?.forEach(plant => {
            this.clectures += plant.readings;
            this.cmedAlerts += plant.medAlerts;
            this.credAlerts += plant.redAlerts;
            this.csensorsDisabled += plant.sensorsDisabled;
        });
    }

    loadPlants(): void {
        const subscription = this.dashboardService.getPlants().subscribe({
            next: (data) => {
                this.plants = data;
                console.log('Plantas cargadas: ', this.plants);
                this.calculateTotals();
            },
            error: () => {
                console.error('Error al cargar las plantas');
            }
        });
        this.subscriptions.push(subscription);
    }

    loadMetrics(): void {
        const subscription = this.dashboardService.getAllMetrics().subscribe({
            next: (data) => {
                if (Array.isArray(data)) {
                    this.metrics = data;
                    console.log('Métricas cargadas:', this.metrics);
                } else {
                    console.error('Los datos no son un array de métricas');
                }
            },
            error: () => {
                console.error('Error al cargar las métricas');
            }
        });
        this.subscriptions.push(subscription);
    }


    onRowClick(plant: GetPlantFlagDto): void {
        this.lFlag = plant.flag;
        this.sCountry = plant.country;
        this.sName = plant.name;

        this.selectedCountryData = this.metrics?.find((metric: CountryEnvironmentalData) =>
            metric.country.toLowerCase() === plant.country.toLowerCase()
        );

        if (this.selectedCountryData) {
            console.log('Métricas de país:', this.selectedCountryData);
        } else {
            console.log('No se encontraron métricas para el país:', plant.country);
        }
    }

    calculateMetrics(nameCountry: string): void {
        this.selectedCountryData = this.metrics?.find((metric: CountryEnvironmentalData) =>
            metric.country.toLowerCase() === nameCountry.toLowerCase()
        );

        if (this.selectedCountryData) {
            console.log('Métricas de país:', this.selectedCountryData);
        } else {
            console.log('No se encontraron métricas para el país:', nameCountry);
        }
    }



    ngOnInit() {
        this.loadPlants();
        this.calculateTotals();
        this.loadMetrics();
        this.userName = this.authService.getUserNameFromToken();
    }
    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
}
