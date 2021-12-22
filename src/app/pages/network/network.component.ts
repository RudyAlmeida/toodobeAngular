import { Component, OnInit } from "@angular/core";
import { FlatTreeControl } from "@angular/cdk/tree";
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from "@angular/material/tree";

import { AlertService, DashboardService } from "../../_services";

interface FoodNode {
  name: string;
  children?: FoodNode[];
}

const TREE_DATA: FoodNode[] = [
  {
    name: "Thiego carvalho",
    children: [{ name: "Apple" }, { name: "Banana" }, { name: "Fruit loops" }],
  },
  {
    name: "Vegetables",
    children: [
      {
        name: "Green",
        children: [{ name: "Broccoli" }, { name: "Brussels sprouts" }],
      },
      {
        name: "Orange",
        children: [{ name: "Pumpkins" }, { name: "Carrots" }],
      },
    ],
  },
];

interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

@Component({
  selector: "app-network",
  templateUrl: "./network.component.html",
  styleUrls: ["./network.component.scss"],
})
export class NetworkComponent implements OnInit {
  network = {};
  networks = [];

  private _transformer = (node: FoodNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
    };
  };

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    (node) => node.level,
    (node) => node.expandable
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.children
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor(
    private alertService: AlertService,
    private dashboardService: DashboardService
  ) {
    const userData = localStorage.getItem("userData");

    if (!userData || userData === "undefined") {
      this.dashboardService.dashboard().subscribe(
        (data) => {
          this.network = data.user.network.levels;
          this.networks = Object.values(this.network).map((item) => {
            members: item;
          });
          localStorage.setItem("userData", JSON.stringify(data));
        },
        ({ error }) => {
          let message = "";
          if (typeof error?.error === "string") {
            message = error?.error;
          } else if (error?.error) {
            try {
              Object.values(error?.error).forEach(
                (item, i) => (message += `${i === 0 ? "" : " ,"}${item}`)
              );
            } catch {}
          }
          this.alertService.error(
            message ||
              "Ops!!! algo deu errado, por favor tente novamente mais tarde."
          );
        }
      );
    } else {
      this.network = JSON.parse(userData).user.network.levels;
      Object.values(this.network).forEach((item: any) => {
        this.networks.push({ members: item.members });
      });
    }

    console.log(this.networks);
    this.dataSource.data = TREE_DATA;
  }

  ngOnInit() {}

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
}
